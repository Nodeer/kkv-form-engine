<?php namespace Kkv\Common\Providers;

use Illuminate\Support\ServiceProvider;
use Kkv\Common\Services\KutiClient;

/**
 * Class KutiServiceProvider
 * @package Kkv\Common\Providers
 */
class KutiServiceProvider extends ServiceProvider
{

    /**
     * @inheritdoc
     */
    protected $defer = true;


    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton('Kkv\Common\Services\KutiClient', function ($app) {

            return new KutiClient();
        });
    }


    /**
     * @inheritdoc
     */
    public function provides()
    {
        return ['Kkv\Common\Services\KutiClient'];
    }
}
