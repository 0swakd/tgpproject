<?php

namespace Tgp\MapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('TgpMapBundle:Default:index.html.twig', array('name' => $name));
    }
}
