<?php

namespace Tgp\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;

class UsersController extends Controller 
{
    public function getAction($nameoremail)
    {
        $user = $this->getUser();

        $response = new JsonResponse();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }
        
        $friend = $this->get('fos_user.user_manager')->findUserByUsernameOrEmail($nameoremail);
       
        if (!is_object($friend) || !($friend instanceof UserInterface)) {
            $response->setData(array("error" => "not found"));
            return $response;
        }
        
        $email = $friend->getEmail();

        $name = $friend->getUsername();

        $arr = array('recherche' => $nameoremail, 'name' => $name, 'mail' => $email);

        $response->setData($arr);

        return $response;
    }
}
