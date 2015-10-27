<?php namespace Kkv\Common\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * Class Kuti
 * @package Kkv\Common\Facades
 *
 * @method static bool|mixed post($url = null, array $options = [])
 * @method static bool|mixed get($url = null, array $options = [])
 */
class Kuti extends Facade
{

    /**
     * @inheritdoc
     */
    protected static function getFacadeAccessor()
    {
        return 'Kkv\Common\Services\KutiClient';
    }
}
