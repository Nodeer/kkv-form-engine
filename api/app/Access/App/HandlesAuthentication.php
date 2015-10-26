<?php namespace Kkv\Access\App;

trait HandlesAuthentication
{

    /**
     * @return AuthService
     */
    public function getAuthService()
    {
        return app(AuthService::class);
    }
}
