<?php
namespace Tgp\Bundle\Entity;

use Doctrine\ORM\Mapping as ORM;


/**
 * @ORM\Entity
 * @ORM\Table(name="client")
 */
class Client 
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $mail;

    /**
     * @ORM\Column(type="decimal", precision=35, scale=30)
     */
    
    protected $maplng;
    /**
     * @ORM\Column(type="decimal", precision=35, scale=30)
     */
 
    protected $maplat;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Client
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set mail
     *
     * @param string $mail
     * @return Client
     */
    public function setMail($mail)
    {
        $this->mail = $mail;

        return $this;
    }

    /**
     * Get mail
     *
     * @return string 
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * Set maplng
     *
     * @param \double $maplng
     * @return Client
     */
    public function setMaplng($maplng)
    {
        $this->maplng = $maplng;

        return $this;
    }

    /**
     * Get maplng
     *
     * @return \double 
     */
    public function getMaplng()
    {
        return $this->maplng;
    }

    /**
     * Set maplat
     *
     * @param \double $maplat
     * @return Client
     */
    public function setMaplat($maplat)
    {
        $this->maplat = $maplat;

        return $this;
    }

    /**
     * Get maplat
     *
     * @return \double 
     */
    public function getMaplat()
    {
        return $this->maplat;
    }
}
