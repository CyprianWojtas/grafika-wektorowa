//ctx.setLineDash([5,5]) - Przerywana linia

function krzywaRysuj(krzywa, aktywna, ctx)
{
	if (krzywa.punkty.length == 0)
		return;
	if (typeof krzywa.pozycja.x !== "number") krzywa.pozycja.x = 0;
	if (typeof krzywa.pozycja.y !== "number") krzywa.pozycja.y = 0;
	if (typeof krzywa.skala.x   !== "number") krzywa.skala.x   = 1;
	if (typeof krzywa.skala.y   !== "number") krzywa.skala.y   = 1;

	pozycja = krzywa.pozycja;
	skala   = krzywa.skala;

	ctx.strokeStyle = krzywa.kolor;
	ctx.fillStyle   = krzywa.wypelnienie;
	rysuj.szerokoscLinii(ctx, krzywa.gruboscLinii);
	if (typeof krzywa.przerywanaLinia == "object")
		ctx.setLineDash(krzywa.przerywanaLinia);

	ctx.beginPath();
	rysuj.przesunDo(ctx, krzywa.punkty[0].p.x, krzywa.punkty[0].p.y);

	for (i = 0; i < krzywa.punkty.length - 1; i++)
	{
		rysuj.krzywa
		(
			ctx,
			krzywa.punkty[i    ].s2.x + krzywa.punkty[i    ].p.x, krzywa.punkty[i    ].s2.y + krzywa.punkty[i    ].p.y,
			krzywa.punkty[i + 1].s1.x + krzywa.punkty[i + 1].p.x, krzywa.punkty[i + 1].s1.y + krzywa.punkty[i + 1].p.y,
			krzywa.punkty[i + 1].p.x, krzywa.punkty[i + 1].p.y
		);
	}

	if (krzywa.zamknieta)
	{
		rysuj.krzywa
		(
			ctx,
			krzywa.punkty[krzywa.punkty.length - 1].s2.x + krzywa.punkty[krzywa.punkty.length - 1].p.x, krzywa.punkty[krzywa.punkty.length - 1].s2.y + krzywa.punkty[krzywa.punkty.length - 1].p.y,
			krzywa.punkty[0].s1.x + krzywa.punkty[0].p.x, krzywa.punkty[0].s1.y + krzywa.punkty[0].p.y,
			krzywa.punkty[0].p.x, krzywa.punkty[0].p.y
		);
	}

	ctx.fill();
	ctx.stroke();

	if (aktywna)
	{
		ctx.strokeStyle = "#800";
		ctx.fillStyle   = "#800";
		rysuj.szerokoscLinii (ctx, 1);
		ctx.setLineDash([]);

		for (i = 0; i < krzywa.punkty.length; i++)
		{
			j = i + 1;

			if (i == krzywa.punkty.length - 1)
			{
				ctx.strokeStyle = "#080";
				ctx.fillStyle   = "#080";

				j = 0;
			}

			ctx.beginPath();
			rysuj.luk(ctx, krzywa.punkty[i].p.x, krzywa.punkty[i].p.y, 2, 0, 2 * Math.PI, null, false);
			rysuj.luk(ctx, krzywa.punkty[j].p.x, krzywa.punkty[j].p.y, 2, 0, 2 * Math.PI, null, false);
			ctx.fill();
			
			ctx.beginPath();
			rysuj.przesunDo(ctx, krzywa.punkty[i].p.x, krzywa.punkty[i].p.y);
			rysuj.liniaDo(ctx, krzywa.punkty[i].s2.x + krzywa.punkty[i].p.x, krzywa.punkty[i].s2.y + krzywa.punkty[i].p.y, false);

			rysuj.przesunDo(ctx, krzywa.punkty[j].p.x,  krzywa.punkty[j].p.y);
			rysuj.liniaDo(ctx, krzywa.punkty[j].s1.x + krzywa.punkty[j].p.x, krzywa.punkty[j].s1.y + krzywa.punkty[j].p.y, false);
			
			let szerStara = ctx.lineWidth;
			ctx.lineWidth /= (krzywa.skala.x + skala.y) / 2;
			ctx.stroke();
			ctx.lineWidth = szerStara;

			ctx.beginPath();
			rysuj.luk(ctx, krzywa.punkty[i].s2.x + krzywa.punkty[i].p.x, krzywa.punkty[i].s2.y + krzywa.punkty[i].p.y, 2, 0, 2 * Math.PI, null, false);
			rysuj.luk(ctx, krzywa.punkty[j].s1.x + krzywa.punkty[j].p.x, krzywa.punkty[j].s1.y + krzywa.punkty[j].p.y, 2, 0, 2 * Math.PI, null, false);
			ctx.fill();
		}
	}
}

let przesuwanyId = 0;
let przesuwanyEl = "p";

function krzywaMouseDown(krzywa, e)
{
	pozX = e.pageX;
	pozY = e.pageY;
	if (e.originalEvent.ctrlKey)
	{
		krzywa.punkty.push(
		{
			p:  { x: pozX / skala.x - krzywa.pozycja.x, y: pozY / skala.y - krzywa.pozycja.y},
			s1: { x: 0, y: 0 },
			s2: { x: 0, y: 0 }
		});

		przesuwanyId = krzywa.punkty.length - 1;
		przesuwanyEl = "s1";
		przesuwanie  = true;
	}
	else if (e.originalEvent.shiftKey)
	{
		pozX = krzywa.pozycja.x - pozX / krzywa.skala.x;
		pozY = krzywa.pozycja.y - pozY / krzywa.skala.y;
		
		przesuwanieC = true;
	}
	else
	{
		for (i in krzywa.punkty)
		{
			let px = (krzywa.punkty[i].p.x + krzywa.pozycja.x) * krzywa.skala.x;
			let py = (krzywa.punkty[i].p.y + krzywa.pozycja.y) * krzywa.skala.y;
			
			let s1x = krzywa.punkty[i].s1.x * krzywa.skala.x;
			let s1y = krzywa.punkty[i].s1.y * krzywa.skala.y;
			
			let s2x = krzywa.punkty[i].s2.x * krzywa.skala.x;
			let s2y = krzywa.punkty[i].s2.y * krzywa.skala.y;

			if (Math.sqrt(Math.pow(s2x + px - pozX, 2) + Math.pow(s2y + py - pozY, 2)) < 5)
			{
				przesuwanyId = i;
				przesuwanyEl = "s2";
				przesuwanie  = true;

				return;
			}
			else if (Math.sqrt(Math.pow(s1x + px - pozX, 2) + Math.pow(s1y + py - pozY, 2)) < 5)
			{
				przesuwanyId = i;
				przesuwanyEl = "s1";
				przesuwanie  = true;

				return;
			}
			else if (Math.sqrt(Math.pow(px - pozX, 2) + Math.pow(py - pozY, 2)) < 5)
			{
				przesuwanyId = i;
				przesuwanyEl = "p";
				przesuwanie  = true;

				return;
			}	
		}
	}
}

function krzywaMouseMove(krzywa, e)
{
	if (przesuwanie)
	{
		let x = e.pageX;
		let y = e.pageY;
		
		if (przesuwanyEl == "p")
		{
			krzywa.punkty[przesuwanyId][przesuwanyEl].x = x / krzywa.skala.x - krzywa.pozycja.x;
			krzywa.punkty[przesuwanyId][przesuwanyEl].y = y / krzywa.skala.y - krzywa.pozycja.y;
		}
		else
		{
			krzywa.punkty[przesuwanyId][przesuwanyEl].x = x / krzywa.skala.x - krzywa.punkty[przesuwanyId].p.x - krzywa.pozycja.x;
			krzywa.punkty[przesuwanyId][przesuwanyEl].y = y / krzywa.skala.y - krzywa.punkty[przesuwanyId].p.y - krzywa.pozycja.y;
		}
	}
	else if (przesuwanieC)
	{
		let x = e.pageX;
		let y = e.pageY;
		krzywa.pozycja.x = pozX + x / krzywa.skala.x;
		krzywa.pozycja.y = pozY + y / krzywa.skala.y;
	}
}

function krzywaWheel(krzywa, e)
{
	e.preventDefault();
	if (e.shiftKey)
	{
		if (e.originalEvent.deltaY < 0)
		{
			krzywa.skala.x *= 1.1;
			krzywa.skala.y *= 1.1;
		}
		else
		{
			krzywa.skala.x /= 1.1;
			krzywa.skala.y /= 1.1;
		}
	}
};