<?php namespace Kkv\Slides\Console\Commands;

use Illuminate\Console\Command;
use Kkv\Slides\App\HandlesSlides;
use Kkv\Slides\Domain\Model\Slide;
use Nord\Lumen\Core\App\ManagesEntities;
use Symfony\Component\Console\Input\InputOption;

class ImportLegacySlidesCommand extends Command
{

    use ManagesEntities;
    use HandlesSlides;

    const DEFAULT_LANGUAGE = 'fi';

    const COLUMN_ID                   = 0;
    const COLUMN_NAME                 = 1;
    const COLUMN_LABEL                = 2;
    const COLUMN_ELEMENTS             = 3;
    const COLUMN_STYLE                = 4;
    const COLUMN_SAVE_AFTER           = 5;
    const COLUMN_SUMMARY_AFTER        = 6;
    const COLUMN_CREATED              = 7;
    const COLUMN_UPDATED              = 8;
    const COLUMN_STATUS               = 9;
    const COLUMN_ORDER_NUMBER         = 10;
    const COLUMN_SUMMARY_LABEL        = 11;
    const COLUMN_EXCLUDE_FROM_SUMMARY = 12;

    /**
     * @var string
     */
    protected $name = 'slide:legacy-import';

    /**
     * @var string
     */
    protected $description = 'Imports slides in legacy format from a CSV file.';

    private static $translatableAttributes = [
        'title',
        'content',
        'label',
        'placeholder',
        'summary_label',
        'body',
        'empty',
    ];


    /**
     * @inheritdoc
     */
    public function fire()
    {
        $this->info('Starting import.');

        $file = $this->option('file');

        if (empty($file)) {
            $this->error('Parameter "file" is required.');

            return 1;
        }

        $filename = realpath($file);

        if (!is_file($filename)) {
            $this->error(sprintf('File "%s" not found.', $filename));
        }

        $data = $this->parseCsvFile($filename);

        array_shift($data);

        foreach ($data as $item) {
            $slide = $this->createSlide($item);

            $this->saveEntity($slide);
        }

        $this->commitEntities();

        return 0;
    }


    /**
     * @param string $filename
     *
     * @return array
     */
    private function parseCsvFile($filename)
    {
        return array_map('str_getcsv', file($filename));
    }


    private function createSlide($data)
    {
        $slide = $this->getSlideService()->createSlide(
            $data[self::COLUMN_NAME],
            $this->normalizeTranslatableString($data[self::COLUMN_LABEL])
        );

        if (isset($data[self::COLUMN_ELEMENTS])) {
            $elements  = json_decode(str_replace('\\', '', $data[self::COLUMN_ELEMENTS]), true);
            if ($elements !== null) {
                $slide->changeElements($this->normalizeElements($elements));
            }
        }
        if (isset($data[self::COLUMN_STYLE])) {
            $style = json_decode(str_replace('\\', '', $data[self::COLUMN_STYLE]), true);
            if ($style !== null) {
                $slide->changeStyle($style);
            }
        }
        $slide->changeSaveAfter($data[self::COLUMN_SAVE_AFTER]);
        $slide->changeSummaryAfter($data[self::COLUMN_SUMMARY_AFTER]);
        if (isset($data[self::COLUMN_SUMMARY_LABEL])) {
            $slide->changeSummaryLabel($this->normalizeTranslatableString($data[self::COLUMN_SUMMARY_LABEL]));
        }

        return $slide;
    }


    /**
     * @param $string
     *
     * @return array
     */
    private function normalizeTranslatableString($string)
    {
        return !empty($string) ? [self::DEFAULT_LANGUAGE => $string] : null;
    }


    /**
     * @param array $elements
     *
     * @return array
     */
    private function normalizeElements(array $elements)
    {
        foreach ($elements as $i => $element) {
            if (isset($element['items'])) {
                $elements[$i]['items'] = $this->normalizeElements($element['items']);
            }

            foreach ($element as $key => $value) {
                if (in_array($key, self::$translatableAttributes)) {
                    $elements[$i][$key] = $this->normalizeTranslatableString($value);
                }
            }
        }

        return $elements;
    }


    /**
     * @inheritdoc
     */
    public function getOptions()
    {
        return [
            ['file', false, InputOption::VALUE_REQUIRED, 'The path to the file to be imported.'],
        ];
    }
}
