---
title: Jimmy and The Wolfpack played at Lakeside Lounge.
date: 2007-01-20T00:00:00
excerpt: I used the write PHP scripts to send mass emails to my mailing list.
summary: I used the write PHP scripts to send mass emails to my mailing list.
image:
tags:
  - shows
  - Jimmy and The Wolfpack
  - Lakeside Lounge
  - Manhattan
  - NYC

---

<?php
$db = mysql_connect("localhost", "hahaha", "ohsure");
mysql_select_db("thebigdb", $db);
$sql = "SELECT * FROM addressnyc;";
$subject = "Jimmy and the Wolfpack Sat Jan 20 at Lakeside Lounge NYC";
$headers = "From: \"Jimmy and the Wolfpack\"<ilovemusicmommy@davidrhoden.com>\nReply-To: ilovemusicmommy@davidrhoden.com\nContent-Type: text/plain; charset=iso-8859-1";
$msg = "Hello Unique Person!

Did you know JIMMY AND THE WOLFPACK is playing this weekend? Well, I did, I've known it for a long time, and the rest of the band told me, the drummer, to send out a big ole e-mail to a thousand people so they'll all know about it too. So if you forward this to a hundred friends, and they each do the same, why, pretty soon the internet will come crashing to a halt and we can all get back to more interesting activities. Like paying sweet attention to the Jimmy and The Wolfpack Band! Do come! We play at eleven sharp and we stop at twelve. The Lakeside Lounge is on Avenue B, B, B, B, B as in Bertha Butt Boogie! It's on Avenue B. I'm pretty sure. No. Wait. Yeah, it is. Avenue B. On Saturday.

Entotainment!

http://www.myspace.com/jimmyandthewolfpack
http://www.davidrhoden.com
http://www.thisismyhappening.com

hasta luego
";
set_time_limit(0);
$result = mysql_query($sql);
$num=1;
while ($row = mysql_fetch_array($result)) {

$to = $row["emailaddress"];
// $to = "davidrhoden@davidrhoden.com";
mail("$to", "$subject", "$msg", "$headers");
echo $num++;
echo " mail sent to $to<br>";

}
?>

![alt text](/static/img/filename)
