<?php
  date_default_timezone_set('Europe/Paris');

  $fileName = "log";
  $fileExtend = ".csv";
  $maxLineNumber = 1000;

  // Open file and get line numberq
  if ($file_handler = fopen($fileName.$fileExtend, "r"))
  {
    $lineNum = 0;
    while (!feof($file_handler)) {
        $lineNum ++;
         echo fgets($file_handler);
    }

    // If file is full -> rename file 
    if($lineNum >= $maxLineNumber)
    {
      $fileNumber = 1;
      while(file_exists($fileName."(".$fileNumber.")".$fileExtend))
      {
        $fileNumber ++;
      }
      rename($fileName.$fileExtend, $fileName."(".$fileNumber.")".$fileExtend);
    }
  }

  // Write file
  $myfile = fopen($fileName.$fileExtend, "a");

  $date = date("Y/m/d");
  $time = date("h:i:sa");
  $query = $_POST['query'];
  $state = $_POST['state'];
  $lang = $_POST['lang'];
  $endPoint = $_POST['endPoint'];

  $query = str_replace("\n", " ", $query);

  $line = "$date\t$time\t$state\t$lang\t$endPoint\t$query\n";

  fwrite($myfile, $line);

  fclose($myfile);

?>