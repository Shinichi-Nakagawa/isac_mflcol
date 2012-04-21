// Mapオブジェクト
var map;

// 初期表示（中心座標）
var latlng = new google.maps.LatLng(45, 120);
// ズームレベル
var zoom = 4;

// マーカーの中身
var data;
// マーカー配列
var markers;
// infowindows
var infowindow;
// XMLHttpオブジェクト
var xmlHttp;

// 表示オプション
var opts = {
	zoom : zoom,
	mapTypeId : google.maps.MapTypeId.SATELLITE,
	center : latlng
};

// TODO クリック時のメッセージ出力、バルーン関係のイベント実装サンプル
function attachMessage(marker, i) {
	// TODO ここまで
	// マーカーを閉じてから開く
	google.maps.event.addListener(marker, 'click', function(event) {
		if(infowindow) {
			infowindow.close();
		}
		infowindow = new google.maps.InfoWindow({
			content : data[i].content
		});
		infowindow.open(markers[i].marker.getMap(), markers[i].marker);
		// 地図の中心座標と、レベルを変える
		map.panTo(data[i].position);
		map.setZoom(7);

	});
}

// 初期処理(MAP読み込み)
function mapload() {
	map = new google.maps.Map(document.getElementById("map"), opts);
	google.maps.event.addListener(map, 'idle', function() {
		get_geo();
	});
	// set_markers();
	map.setZoom(7);

	// TODO kmlを読み込む
	//	kmlload(map);
}

// kmlを読み込む
function kmlload(map) {
	var kmlUrl = "http://mage-p.org/kml/IGRF2005_MFL_20120308.kmz";
	var kmlLayer = new google.maps.KmlLayer(kmlUrl);
	kmlLayer.setMap(map);
}

// マーカー作成
function create_marker(position, map) {
	return new google.maps.Marker({
		position : position,
		map : map
	});
}

// TODO マーカー作成
function set_markers() {
	get_markerlist();
	markers = new Array();
	for( i = 0; i < data.length; i++) {
		var myMarker = create_marker(data[i].position, map);
		markers.push({
			marker : myMarker
		});
		attachMessage(myMarker, i);

		//TODO 写真を読み込む
		//TODO 4sqを読み込む
	}
}

// TODO マーカーの元ネタ作成
// TODO ここを動的に作れれば完璧
function get_markerlist() {
	data = new Array();
	data.push({
		position : new google.maps.LatLng(45.0, 120.0),
		content : "中国"
	});
	data.push({
		position : new google.maps.LatLng(-27.941743, 120.861950),
		content : "オーストラリア"
	});
}