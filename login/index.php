<?php

include('settings.php');
$response = "";
echo "Translator login";

// var_dump($_POST);
if (isset($_POST['type']) && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password'])){
  if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
    $response = "error : mail not available";
    echo $response;

  }
  $type =$_POST['type'];
  $name = $_POST['name'];
  $email = $_POST['email'];

  //instantiation PDO
  try {
      $pdo = new PDO($db, $user, $pwd);
      $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    }
  catch (PDOException $e) { echo 'Connection failed: ' . $e->getMessage();}

  //login
  if($_POST['type']=="login"){

    // echo $password;
    $password = $_POST['password'];

    $sql = "SELECT use_key, use_id, use_confirm FROM user WHERE use_nom='$name' AND use_email='$email'";
    //

    try{
      $prep = $pdo->prepare($sql);
      $prep->execute();
      $result = $prep->fetchAll(PDO::FETCH_ASSOC);

    if(count($result)){

        if( password_verify($password, $result[0]['use_key'])){

          if($result[0]['use_confirm']){

            $user = array("id" => $result[0]['use_id'],"name" => $name);
            setcookie("user", json_encode($user),time()+3600,"/");
            header("Location:".$baseurl); die();

          }
          else{ header("Location:".$linklogin."3"); die(); }


        }
        else{   header("Location:".$linklogin."2"); die(); }

    }
    else{
          header("Location:".$linklogin."1"); die();
        }
    }
    catch(Exception $e){ echo $e->getMessage(); }


  }//end login

  //SUSCRIBE
  if($_POST['type']=="suscribe"){

    //add a new user avec le password hashé
    //hash du password
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    //SQL request
    //email and name doivent être unique
    $sql = "INSERT INTO user VALUES (default, '$name', '$password', '$email', default, default)";
    try{
        $prep = $pdo->prepare($sql);
        if($prep->execute()){
          //populate confirmation table with generated key
          $key = sha1(mt_rand(10000,99999).time().$name);
          //get use_id
          $sql = "SELECT use_id FROM user WHERE use_key='$password'";
          try{
            $prep = $pdo->prepare($sql);
            $prep->execute();
            $result = $prep->fetchAll(PDO::FETCH_ASSOC);
            if(count($result)){
              $id = $result[0]['use_id'];
              $sql = "INSERT INTO confirmation VALUES (default, '$key',$id, default)";
              try{
                  $prep = $pdo->prepare($sql);
                  $prep->execute();
                  //
                  $href = urlencode($linkmail.$key);
                  $to = $email;
                  $subject = "Translator activation";
                  $message = "<h3>Hello ".$name."</h3><p> Please copy/paste this link in your browser to activate your account on Translator : <br/>";
                  $message .= $linkmail.$key."</p>";
                  $message .= "<h5>The <a href='https://www.julie-danjou'>Translator</a> Team</h5>";
                  $headers = array('From: noreply','Content-Type: text/html');
                  mail($to, $subject, $message, implode("\r\n",$headers));
                  header("Location:".$endsubscription); die();
                }
                catch(Exception $e){ echo $e->getMessage(); }

              }//end IF
            }//END TRY
            catch(Exception $e){ echo $e->getMessage(); }
    }//end  first execute
  }//end first try
    catch(Exception $e){ echo $e->getMessage(); }
}//END SUSCRIBE


}
else {

    if (isset($_POST['logout'])){

        setcookie("user", '',time()-3600,"/");
        echo 'logout setcookie in the past';
     }
      else{
        $response = "error : missing parameters";
        return $response;
      }

}
?>
