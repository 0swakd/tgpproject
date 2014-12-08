<?php

namespace Tgp\Bundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction(/*$name*/)
    {
        $annex = "TGP";

//        return $this->render('TgpBundle:Default:index.html.twig', array('name' => $name." dans ".$annex));
        return $this->render('TgpBundle:Default:index.html.twig', array('variable' => "ahah".$annex));
    }
}
