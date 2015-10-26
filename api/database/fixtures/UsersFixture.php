<?php namespace Kkv\Fixtures;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Eventello\Access\Domain\Model\User;
use Nord\Lumen\Core\Domain\Model\ObjectId;

class UsersFixture extends AbstractFixture implements FixtureInterface, OrderedFixtureInterface
{

    /**
     * @inheritdoc
     */
    public function load(ObjectManager $manager)
    {
        $superuser = new User(new ObjectId(), 'demo@example.com', 'demo12', 'superuser', 'Demo', 'User');

        $manager->persist($superuser);
        $manager->flush();

        $this->addReference('superuser', $superuser);
    }


    /**
     * @inheritdoc
     */
    public function getOrder()
    {
        return 0;
    }
}
