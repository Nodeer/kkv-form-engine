<?php namespace Kkv\Common\Console;

use Illuminate\Console\Scheduling\Schedule;

class Kernel extends \Laravel\Lumen\Console\Kernel
{

    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        'Kkv\Slides\Console\Commands\ImportLegacySlidesCommand',
    ];


    /**
     * Define the application's command schedule.
     *
     * @param Schedule $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Schedule tasks
    }
}
