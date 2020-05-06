let skala =
{
	x: 1,
	y: 1
};
let pozycja =
{
	x: 0,
	y: 0
};

rysuj = {};

rysuj.szerokoscLinii = function (ctx, s)
{
	ctx.lineWidth = s * (skala.x + skala.y) / 2;
}

rysuj.krzywa = function (ctx, p1x, p1y, p2x, p2y, p3x, p3y)
{
	ctx.bezierCurveTo
	(
		(p1x + pozycja.x) * skala.x, (p1y + pozycja.y) * skala.y,
		(p2x + pozycja.x) * skala.x, (p2y + pozycja.y) * skala.y,
		(p3x + pozycja.x) * skala.x, (p3y + pozycja.y) * skala.y
	);
}

rysuj.przesunDo = function (ctx, px, py)
{
	ctx.moveTo((px + pozycja.x) * skala.x, (py + pozycja.y) * skala.y);
}

rysuj.liniaDo = function (ctx, px, py)
{
	ctx.lineTo((px + pozycja.x) * skala.x, (py + pozycja.y) * skala.y);
}

rysuj.luk = function (ctx, px, py, promien, ks, kk, kierunek, skalowanie = true)
{
	if (skalowanie)
		ctx.arc
		(
			(px + pozycja.x) * skala.x,
			(py + pozycja.y) * skala.y,
			promien * (skala.x + skala.y) / 2,
			ks,
			kk,
			kierunek
		);
	else
		ctx.arc
		(
			(px + pozycja.x) * skala.x,
			(py + pozycja.y) * skala.y,
			promien,
			ks,
			kk,
			kierunek
		);
}