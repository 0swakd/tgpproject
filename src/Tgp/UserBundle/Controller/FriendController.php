<?php

namespace Tgp\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use FOS\UserBundle\Model\UserInterface;

class FriendController extends Controller 
{
    public function addAction($name)
    {
        $user = $this->getUser();

        $response = new JsonResponse();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }
        
        $friend = $this->get('fos_user.user_manager')->findUserByUsername($name);
       
        if (!is_object($friend) || !($friend instanceof UserInterface)) {
            $response->setData(array("error" => "not found"));
            return $response;
        }
        
        $user->addMyFriend($friend);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $email = $friend->getEmail();

        $name = $friend->getUsername();
        $id = $friend->getId();

        $arr = array('name' => $name, 'id' => $id);

        $response->setData($arr);

        return $response;
    }

    public function removeAction($name)
    {
        $user = $this->getUser();

        $response = new JsonResponse();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }
        
        $friend = $this->get('fos_user.user_manager')->findUserByUsername($name);
       
        if (!is_object($friend) || !($friend instanceof UserInterface)) {
            $response->setData(array("error" => "not found"));
            return $response;
        }
        
        $user->removeMyFriend($friend);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $email = $friend->getEmail();

        $name = $friend->getUsername();
        $id = $friend->getId();

        $arr = array('name' => $name, 'id' => $id);

        $response->setData($arr);

        return $response;
    }

    public function listAction() 
    {
        $response = new JsonResponse();

        $user = $this->getUser();

        if (!is_object($user) || !($user instanceof UserInterface)) {
            $response->setData(array("error" => "not connected"));
            return $response;
        }

        $friends = $user->getMyFriends();

        foreach($friends as $key => $friend) {
            $arr[$friend->getId()] = array("name" => $friend->getUsername(), "id" => $friend->getId());
        }

        $response->setData($arr);

        return $response;
    }

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

