<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
use Adnow\Trip as Trip;

require_once '../lib/lib.php';

function jsonResponse($data, $error = false, $errorMessage = 'Unknown error') {
	$response = array();
	$response['error'] = $error;
	if ($error) {
		$response['message'] = $errorMessage;
	}
	$response['data'] = $data;

	return json_encode($response);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');


if (!filter_has_var(INPUT_POST, 'v_geo')) {
    die(jsonResponse(null, true, 'No latitude/longitude given!'));
}

list($userLat, $userLng) = explode(',', filter_input(INPUT_POST, 'v_geo'));

if ($userLat ===  false || $userLng === false) {
    die(jsonResponse(null, true, 'No location given!'));
}
$pdo = new PDO(DB_PDO_DRIVER);
// get the store

$queryGetStores = "WITH shop_by_distances AS ( SELECT ST_SetSRID(ST_Point(:longitude,:latitude), 4326) <-> geom AS distance, public.shop.id, public.shop.client, public.shop.name, public.shop.lat, public.shop.long FROM public.shop INNER JOIN public.client on public.shop.client = public.client.id WHERE internal_id='6400e8e21dfc8385c3ab33beacd808') SELECT * FROM shop_by_distances ORDER BY distance LIMIT 3";
$queryParameters = array(':latitude' => $userLat, ':longitude' => $userLng);


$pdoStoresStatement = $pdo->prepare($queryGetStores);
if (!$pdoStoresStatement->execute($queryParameters)) {
	die(jsonResponse(null, true, $pdoStoresStatement->errorInfo()));
}
$storesResults = $pdoStoresStatement->fetchAll(PDO::FETCH_ASSOC);
$pdoStoresStatement->closeCursor();

$endPoints = array();
$stores = array();
foreach ($storesResults as $storeResult) {
	array_push($endPoints, new Trip\Point($storeResult['id'], $storeResult['lat'], $storeResult['long']) );
	$stores[$storeResult['id']] = $storeResult;
}

// get distances from user position
$startPoint = new Trip\Point(0, $userLat, $userLng);
$trip = new Trip\Trip(DISTANCE_API_END_POINT);
$distances = $trip->distances($startPoint, $endPoints);

foreach ($stores as $storeResult) {
	$stores[$storeResult['id']]['distance'] = $distances[$storeResult['id']]->meters();
	$stores[$storeResult['id']]['time'] = $distances[$storeResult['id']]->time();
}
// sort stores by distances
uasort($stores, function ($a, $b) {
    if ($a['distance'] == $b['distance']) {
        return 0;
    }
    return $a['distance'] < $b['distance'] ? -1 : 1;
});

//Get store which with better distance
$store =  array_values($stores)[0];
$storeAdditionalParameter = (array)json_decode($store['name']);
$store =  array_merge($store, $storeAdditionalParameter);

echo jsonResponse(array('store' => $store));
