<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$app->get('/', function () use ($app) {
    return 'It works!';
});

// App routes

$app->group([
    'prefix'    => 'v1',
    'namespace' => 'Kkv\Common\Http',
], function () use ($app) {
    // todo
});

// Access context routes

$app->group([
    'prefix'    => 'v1',
    'namespace' => 'Kkv\Access\Http',
], function () use ($app) {
    $app->post('auth/login', 'AuthController@login');
    $app->get('auth/validate', 'AuthController@validateToken');
    $app->post('auth/refresh', 'AuthController@refreshToken');
});

$app->group([
    'prefix'     => 'v1',
    'namespace'  => 'Kkv\Access\Http',
    'middleware' => 'oauth2',
], function () use ($app) {
    // User actions
    $app->post('users', 'UserController@createUser');
    $app->get('users', 'UserController@listUsers');
    $app->get('users/{user_id}', 'UserController@readUser');
    $app->put('users/{user_id}', 'UserController@updateUser');
    $app->delete('users/{user_id}', 'UserController@deleteUser');
    $app->get('me', 'UserController@readCurrentUser');
});

