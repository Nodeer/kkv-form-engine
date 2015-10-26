<?php namespace Kkv\Fixtures;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Nord\Lumen\OAuth2\Doctrine\Entities\Client;

class OAuth2ClientsFixture implements FixtureInterface
{

    /**
     * @inheritdoc
     */
    public function load(ObjectManager $manager)
    {
        $client = new Client(env('OAUTH2_CLIENT_ID'), env('OAUTH2_CLIENT_SECRET'), 'KKV Form Engine');

        $manager->persist($client);
        $manager->flush();
    }
}
