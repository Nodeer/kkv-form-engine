<?php namespace Kkv\Common\Services;

use Guzzle\Http\Client;
use GuzzleHttp\Message\RequestInterface;
use Illuminate\Support\Facades\Log;
use Nord\Lumen\Core\Exception\Exception;

/**
 * Class KutiClient
 * @package Kkv\Common\Services
 */
class KutiClient
{

    /**
     * @var Client
     */
    private $client;

    /**
     * @var string
     */
    private $baseUrl;

    /**
     * @var array
     */
    private $defaultOptions;


    /**
     * Class constructor.
     *
     * @return KutiClient
     */
    public function __construct()
    {
        $this->client = new Client();
        $this->baseUrl = env('KUTI_URL');
        $this->defaultOptions = [
            'headers' => [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json; charset=utf-8',
            ],
        ];
    }


    /**
     * @param string $url
     *
     * @throws Exception
     */
    public function setBaseUrl($url)
    {
        if (empty($url)) {
            throw new Exception('Base URL cannot be empty.', 500);
        }
        $this->baseUrl = $url;
    }


    /**
     * @param string|null  $url
     * @param array $options
     *
     * @return bool|mixed
     * @throws Exception
     */
    public function get($url = null, array $options = [])
    {
        try {
            $options += $this->defaultOptions;
            /** @var RequestInterface $response */
            $response = $this->client->get($this->baseUrl . $url, $options);
        } catch (Exception $e) {
            Log::error(sprintf('Could not GET from %s, Exception: %s, Code: %s, Options: %s', $this->baseUrl . $url,
                $e->getMessage(), $e->getCode(), var_export($options, true)));

            throw $e;
        }

        $responseBody = $response->getBody()->getContents();
        if (!empty($responseBody) && ($body = json_decode($responseBody))) {
            return $body;
        }
        Log::error(sprintf('Could not parse response body. Response: %s', var_export($responseBody, true)));

        return false;
    }


    /**
     * @param string|null  $url
     * @param array $options
     *
     * @return bool|mixed
     * @throws Exception
     */
    public function post($url = null, array $options = [])
    {
        try {
            $options += $this->defaultOptions;
            /** @var RequestInterface $response */
            $response = $this->client->post($this->baseUrl . $url, $options);
        } catch (Exception $e) {
            Log::error(sprintf('Could not POST to %s, Exception: %s, Code: %s, Options: %s', $this->baseUrl . $url,
                $e->getMessage(), $e->getCode(), var_export($options, true)));

            throw $e;
        }

        $body = $response->getBody();
        $responseBody = null;
        if (is_object($body)) {
            $responseBody = $body->getContents();
        }
        if (!empty($responseBody) && ($body = json_decode($responseBody))) {
            return $body;
        }
        Log::error(sprintf('Could not parse response body. Response: %s', var_export($responseBody, true)));

        return false;
    }
}
