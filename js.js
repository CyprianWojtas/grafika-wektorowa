let c   = $("canvas")[0];
let ctx = c.getContext("2d");


let objekty = [];

function Rysuj()
{
	ctx.clearRect(0, 0, c.width, c.height);

	for(i in objekty)
	{
		let aktywny = false;
		if (objektAktywny == i)
			aktywny = true;

		switch (objekty[i].typ)
		{
			case "krzywa":
				krzywaRysuj(objekty[i], aktywny, ctx);
				break;
		}
	}
}

setInterval(Rysuj, 20);

let pozX = 0;
let pozY = 0;
let objektAktywny = -1;
let przesuwany =
{
	objekt: false
};
let przesuwanyObj = 0;
let przesuwanie  = false;
let przesuwanieC = false;

$(document).on("mousemove", function (e)
{
	if (objektAktywny != -1)
		if (objekty[objektAktywny].typ == "krzywa")
			krzywaMouseMove(objekty[objektAktywny], e);
});

$(c).on("mousedown", function (e)
{
	if (objektAktywny != -1)
		if (objekty[objektAktywny].typ == "krzywa")
			krzywaMouseDown(objekty[objektAktywny], e);
});

$(document).on("wheel", function (e)
{
	e.preventDefault();
	if (objektAktywny != -1)
		if (objekty[objektAktywny].typ == "krzywa")
			krzywaWheel(objekty[objektAktywny], e);
});

$(document).on("mouseup", function (e)
{
	przesuwanie  = false;
	przesuwanieC = false;
});

function odswierzRozmiar()
{
	c.width  = window.innerWidth;
	c.height = window.innerHeight;
	Rysuj();
}

document.body.onresize = odswierzRozmiar;
odswierzRozmiar();

function krzywaDodaj()
{
	objekty.push(
		{
			typ: "krzywa",
			kolor: "#000000FF",
			wypelnienie: "#FF0000FF",
			gruboscLinii: 2,
			pozycja:
			{
				x: 0,
				y: 0
			},
			skala:
			{
				x: 1,
				y: 1
			},
			punkty: []
		}
	);

	if (objektAktywny != -1)
	{
		let nowy = objekty[objekty.length - 1];

		nowy.kolor        = objekty[objektAktywny].kolor;
		nowy.wypelnienie  = objekty[objektAktywny].wypelnienie;
		nowy.gruboscLinii = objekty[objektAktywny].gruboscLinii;
	}

	objektAktywny = objekty.length - 1;

	$(".elementy").append("<div onclick='ustawAktywny(" + objektAktywny + ")'>Krzywa " + (objektAktywny + 1) + "</div>");

	ustawAktywny(objektAktywny);
}

function krzywaDuplikuj()
{
	if (objektAktywny != -1)
	{
		objekty.push(JSON.parse(JSON.stringify(objekty[objektAktywny])));
		objektAktywny = objekty.length - 1;
		$(".elementy").append("<div onclick='ustawAktywny(" + objektAktywny + ")'>Krzywa " + (objektAktywny + 1) + "</div>");
		ustawAktywny(objektAktywny);
	}
}

function krzywaUsunPunkt()
{
	if (objektAktywny != -1)
	{
		objekty[objektAktywny].punkty.pop();
	}
}

function ustawAktywny(id)
{
	$(".elementy div").removeClass("aktywny");
	$(".elementy div:nth-child(" + (id + 1) + ")").addClass("aktywny");

	objektAktywny = id;

	$(".tloKolor")[0].jscolor.fromString(objekty[objektAktywny].wypelnienie.substr(0, 7));
	$(".tloNieprz").val(parseInt(objekty[objektAktywny].wypelnienie.substr(7, 2), 16));

	$(".liniaKolor")[0].jscolor.fromString(objekty[objektAktywny].kolor.substr(0, 7));
	$(".liniaNieprz").val(parseInt(objekty[objektAktywny].kolor.substr(7, 2), 16));

	$(".liniaGrubosc").val(objekty[objektAktywny].gruboscLinii);

	$(".krzywaZamknieta").prop("checked", objekty[objektAktywny].zamknieta);
}

function aktualizujUstawienia()
{
	if (objektAktywny != -1)
	{
		objekty[objektAktywny].wypelnienie = "#" + $(".tloKolor")  .val() + ("0" + parseInt($(".tloNieprz")  .val()).toString(16).toUpperCase()).slice(-2);
		objekty[objektAktywny].kolor =       "#" + $(".liniaKolor").val() + ("0" + parseInt($(".liniaNieprz").val()).toString(16).toUpperCase()).slice(-2);

		objekty[objektAktywny].gruboscLinii = parseInt($(".liniaGrubosc").val());

		objekty[objektAktywny].zamknieta = $(".krzywaZamknieta").prop("checked");
	}
}

function eksportujPNG()
{
	let akt = objektAktywny;
	objektAktywny = -1;
	setTimeout(() =>
	{
		let obraz = document.createElement('a');
		obraz.setAttribute('href', c.toDataURL("image/png").replace(/^data:image\/[^;]+/, 'data:application/octet-stream'));
		obraz.setAttribute('download', "obraz.png");
		obraz.style.display = 'none';
		document.body.appendChild(obraz);
	  
		obraz.click();
	  
		document.body.removeChild(obraz);

		ustawAktywny(akt);
	}, 100);
}

function generujDoDruku()
{
	let cDruk = document.createElement("canvas");
	let ctxDruk = cDruk.getContext("2d");

	cDruk.width  = 3564;
	cDruk.height = 2520;

	let prop = window.innerWidth / window.innerHeight;
	let margines = 0;
	let marginesGora = false;
	let PROP_KARTKA = 1.6054054054054;

	if (prop > PROP_KARTKA)
	{
		marginesGora = true;
		while((window.innerWidth - margines) / window.innerHeight > PROP_KARTKA)
		{
			margines++;
		}
	}
	else
	{
		while(window.innerWidth / (window.innerHeight - margines) < PROP_KARTKA)
		{
			margines++;
		}
	}

	let skalowanie = window.innerWidth / cDruk.width;

	if (skalowanie < window.innerHeight / (cDruk.height - 300))
		skalowanie = window.innerHeight / (cDruk.height - 300);

	var img = new Image;
	img.onload = function()
	{
		ctxDruk.drawImage(img, 0, 0);
        let imgWZS = ctxDruk.getImageData(0, cDruk.height - 300, cDruk.width, 300);
		let objDoDruku = JSON.parse(JSON.stringify(objekty));
		
		for (i in objDoDruku)
		{
			objDoDruku[i].skala.x /= skalowanie;
			objDoDruku[i].skala.y /= skalowanie;
			
			if (marginesGora)
				objDoDruku[i].pozycja.y += (margines / objDoDruku[i].skala.y) / 2;
			else
				objDoDruku[i].pozycja.x += (margines / objDoDruku[i].skala.x) / 2;

			krzywaRysuj(objDoDruku[i], false, ctxDruk);
		}
		
		ctxDruk.putImageData(imgWZS, 0, cDruk.height - 300);

		//window.open(cDruk.toDataURL("image/png"), "blank_");
        
        let obraz = document.createElement('a');
		obraz.setAttribute('href', cDruk.toDataURL("image/png").replace(/^data:image\/[^;]+/, 'data:application/octet-stream'));
		obraz.setAttribute('download', "obraz.png");
		obraz.style.display = 'none';
		document.body.appendChild(obraz);
	  
		obraz.click();
	  
		document.body.removeChild(obraz);

	};
	img.src = "tlo.png";
}

setInterval(aktualizujUstawienia, 100);

$(".tloObraz").change(e =>
{
	$("body").css("background-image", "url(" + e.originalEvent.target.value + ")");
});
