<?php

namespace Tgp\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Tgp\Bundle\Entity\Client;

class DefaultController extends Controller {
    public function indexAction(/*$name*/) {
        $annex = "TGP";

        $dbl = 1.12;

        $client = new Client();
        $client->setName('Roger');
        $client->setMail('Roger');
        $client->setMaplng($dbl);
        $client->setMaplat($dbl);

        $em = $this->getDoctrine()->getManager();
//        $em->persist($client);
//        $em->flush();

        return $this->render('TgpBundle:Default:index.html.twig', array('variable' => "ahah".$annex));
    }

    public function testAction(/*$name*/) {
        return $this->render('TgpBundle:Default:index-test.html.twig');
    }



    public function connectionAction() {
        $request = Request::createFromGlobals();

        $pass = $request->query->get('pass');
        $pseudo = $request->query->get('login');

        $client = Client::get_client($pass, $pseudo);

        return $this->render('TgpBundle:Json:connection-response.json.twig', array('response' => $client));
    }

    public function creationClient() {
        $client = new Client();
        $client->setName('Roger');

        $em = $this->getDoctrine()->getManager();
        $em->persist($client);
        $em->flush();
    }
}
