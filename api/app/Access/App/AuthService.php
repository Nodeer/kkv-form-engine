<?php namespace Kkv\Access\App;

use Illuminate\Support\Facades\Auth;

final class AuthService
{

    /**
     * @param string $username
     * @param string $password
     *
     * @return bool
     */
    public function authenticate($username, $password)
    {
        /** @noinspection PhpUndefinedMethodInspection */
        return Auth::attempt(['email' => $username, 'password' => $password]);
    }
}
