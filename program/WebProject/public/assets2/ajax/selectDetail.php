<?
$cluster   = Cassandra::cluster();
$cluster.build();
$session   = $cluster->connect("registration");
$statement = new Cassandra\SimpleStatement("SELECT * FROM detail");
$result    = $session->execute($statement);
echo "Result contains " . $result->count() . " rows";