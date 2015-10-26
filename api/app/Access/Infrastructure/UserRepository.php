<?php namespace Kkv\Access\Infrastructure;

use Kkv\Access\Domain\Model\User;
use Nord\Lumen\Core\Infrastructure\EntityRepository;

class UserRepository extends EntityRepository
{

    /**
     * @param string $email
     *
     * @return User|null
     */
    public function findByEmail($email)
    {
        return $this->findOneBy(['email' => $email]);
    }


    /**
     * @param string $token
     *
     * @return User|null
     */
    public function findByRememberToken($token)
    {
        return $this->findOneBy(['rememberToken' => $token]);
    }
}
