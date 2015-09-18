<?php
// src/Tgp/MapBundle/Entity/Place.php
namespace Tgp\MapBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\HasLifecycleCallbacks
 * @ORM\Table(name="place")
 */
class Place
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=8)
     */
    protected $latitude;

    /**
     * @ORM\Column(type="decimal", precision=11, scale=8)
     */
    protected $longitude;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $name;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    protected $geoJSON;


    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    protected $osmNominatim;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $timestampcreated;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    protected $timestampupdated;



    /**
     * @ORM\ManyToMany(targetEntity="Tgp\UserBundle\Entity\User", mappedBy="places")
     **/
    private $users;

    public function __construct() {
        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
    }


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
     * Set latitude
     *
     * @param string $latitude
     * @return Geoloc
     */
    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;

        return $this;
    }

    /**
     * Get latitude
     *
     * @return string 
     */
    public function getLatitude()
    {
        return $this->latitude;
    }

    /**
     * Set longitude
     *
     * @param string $longitude
     * @return Geoloc
     */
    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * Get longitude
     *
     * @return string 
     */
    public function getLongitude()
    {
        return $this->longitude;
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
     * Get geoJSON
     *
     * @return string 
     */
    public function getGeoJSON()
    {
        return $this->geoJSON;
    }

    /**
     * Get osmNominatim
     *
     * @return string 
     */
    public function getOsmNominatim()
    {
        return $this->osmNominatim;
    }

    /**
     * Get timestampcreated
     *
     * @return datetime
     */
    public function getTimestampCreated()
    {
        return $this->timestampcreated;
    }

    /**
     * Get timestampupdated
     *
     * @return datetime
     */
    public function getTimestampUpdated()
    {
        return $this->timestampupdated;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Place
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Add users
     *
     * @param \Tgp\UserBundle\Entity\User $users
     * @return Place
     */
    public function addUser(\Tgp\UserBundle\Entity\User $users)
    {
        $this->users[] = $users;

        return $this;
    }

    /**
     * Remove users
     *
     * @param \Tgp\UserBundle\Entity\User $users
     */
    public function removeUser(\Tgp\UserBundle\Entity\User $users)
    {
        $this->users->removeElement($users);
    }

    /**
     * Get users
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getUsers()
    {
        return $this->users;
    }


    /**
     * Set Creation 
     */
    public function setTimestampUpdated($timestamp) 
    {
        $this->timestampupdated = $timestamp;

        return $this;
    }


    /**
     * Set Modification
     */
    public function setTimestampCreated($timestamp) 
    {
        $this->timestampcreated = $timestamp;

        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps() 
    {
        $this->setTimestampUpdated(new \DateTime(date('Y-m-d H:i:s')));

        if($this->getTimestampCreated() == null) 
        {
            $this->setTimestampCreated(new \DateTime(date('Y-m-d H:i:s')));
        }
    }
}
