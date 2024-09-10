<?php
include('settings.php');
$response = "";
//

if (isset($_GET['key'])){

  $key = $_GET['key'];

  //instantiation PDO
  try {
      $pdo = new PDO($db, $user, $pwd);
      $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
    }
  catch (PDOException $e) { $response = 'Connection failed: ' . $e->getMessage();}

  //select in table confirmation
  $sql = "SELECT con_user FROM confirmation WHERE con_key='$key'";
  //

  try{
    $prep = $pdo->prepare($sql);
    $prep->execute();
    $result = $prep->fetchAll(PDO::FETCH_ASSOC);

  if(count($result)){
    $userid = $result[0]['con_user'];
    $sql = "SELECT use_confirm FROM user WHERE use_id= $userid";
    try{
      $prep = $pdo->prepare($sql);
      $prep->execute();
      $result = $prep->fetchAll(PDO::FETCH_ASSOC);
      if(count($result)){
        $confirm = $result[0]['use_confirm'] ;
        if(!$confirm){
          $sql = "UPDATE user set use_confirm =1 WHERE use_id= $userid";
          $prep = $pdo->prepare($sql);
          $prep->execute();
          header("Location:".$baseurl."login/login.html"); die();

        }
        else{ $response= " Your account is already active."; }
      }

    }
    catch(Exception $e){ $response= $e->getMessage(); }





  }
  else{ $response="No account find. Please suscribe for an account"; }

  }

  catch(Exception $e){ $response= $e->getMessage(); }



}
else{

    $response="WTF ??";

   }




 ?>

 <!DOCTYPE html>
 <html>
   <head>
     <meta charset="utf-8">
     <title>Activation Account</title>
   </head>
   <body>
     <p>
       <?php echo $response ?>
     </p>
   </body>
 </html>
