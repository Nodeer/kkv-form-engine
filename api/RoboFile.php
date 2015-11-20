<?php

ini_set('memory_limit', '2048M');

use Alchemy\Zippy\Zippy;
use Aws\S3\S3Client;
use League\Flysystem\AwsS3v2\AwsS3Adapter;
use League\Flysystem\Filesystem;

Dotenv::load(__DIR__, '.env.deploy');

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks
{

    /**
     * Build task.
     *
     * @return bool
     */
    public function build()
    {
        $this->say('Build task');

        $envFile = __DIR__ . '/.env.dist';

        if (!file_exists($envFile)) {
            $this->yell(sprintf('The environment "%s" file does not exist!', $envFile));

            return false;
        }

        $buildPath = $this->getBuildPath();
        $filename  = 'api_' . time() . '.zip';

        $this->say("Creating archive $filename in $buildPath");

        $zippy = Zippy::load();
        $zippy->create("$buildPath/$filename", [
            'app'                                => __DIR__ . '/app',
            'bootstrap'                          => __DIR__ . '/bootstrap',
            'config'                             => __DIR__ . '/config',
            'data'                               => __DIR__ . '/data',
            'deploy'                             => __DIR__ . '/deploy',
            'public'                             => __DIR__ . '/public',
            'resources'                          => __DIR__ . '/resources',
            'vendor'                             => __DIR__ . '/vendor',
            'artisan'                            => __DIR__ . '/artisan',
            '.env'                               => $envFile,
        ]);

        $this->say("Done!");

        return true;
    }


    /**
     * Deploy task.
     *
     * @return bool
     */
    public function deploy()
    {
        $this->say('Deploy task');

        $buildPath = $this->getBuildPath();

        $latestBuild = $this->findLastModifiedFile($buildPath);

        if ($latestBuild === null) {
            $this->say('No build to deploy! Try running the build task first.');
            exit(1);
        }

        $destinationPath = 'releases/api-latest.zip';

        $this->say("Uploading build $latestBuild to S3");

        $this->getS3FileSystem()
            ->put($destinationPath, file_get_contents($buildPath . '/' . $latestBuild));

        $this->say("Done!");

        return true;
    }


    /**
     * @param string $dir
     *
     * @return string|null
     */
    protected function findLastModifiedFile($dir)
    {
        $dir              = rtrim($dir, '/') . '/';
        $lastModified     = 0;
        $lastModifiedFile = null;

        foreach (scandir($dir) as $entry) {
            // Skip hidden files
            if (strpos($entry, '.') === 0) {
                continue;
            }
            $filename     = $dir . $entry;
            $fileModified = filectime($filename);
            if (is_file($filename) && $fileModified > $lastModified) {
                $lastModified     = $fileModified;
                $lastModifiedFile = $entry;
            }
        }

        return $lastModifiedFile;
    }


    /**
     * @return \League\Flysystem\Filesystem
     */
    protected function getS3FileSystem()
    {
        $client = S3Client::factory([
            'key'    => env('S3_KEY'),
            'secret' => env('S3_SECRET'),
            'region' => env('S3_REGION'),
        ]);

        $adapter = new AwsS3Adapter($client, env('S3_BUCKET'));

        return new Filesystem($adapter);
    }


    /**
     * @return string
     */
    protected function getBuildPath()
    {
        return __DIR__ . '/releases';
    }
}
