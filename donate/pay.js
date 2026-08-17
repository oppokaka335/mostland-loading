(function () {
	"use strict";

	var PACKS = {
		mini: { min: 10, title: "VIP 10 минут", hint: "Проверка кассы. Через 10 минут спадёт." },
		week: { min: 100, title: "VIP 7 дней", hint: "Группа VIP и работа VIP в F4." },
		month: { min: 300, title: "VIP 30 дней", hint: "Тот же VIP на месяц. Срок складывается." },
		life: { min: 700, title: "VIP навсегда", hint: "Без срока. Работа VIP в F4." },
		unban: { min: 100, title: "Разбан", hint: "Снимает бан-комнату. VIP не даёт." }
	};
	var CASHIER = "https://donatepay.eu/don/49286";
	var CASHIER_MIN = 25;
	var CODE_RE = /^MOST-[2-9A-HJ-NP-Z]{8}$/;

	function $(id) {
		return document.getElementById(id);
	}

	function params() {
		var q = {};
		var search = window.location.search.replace(/^\?/, "").split("&");
		for (var i = 0; i < search.length; i++) {
			if (!search[i]) continue;
			var parts = search[i].split("=");
			var k = decodeURIComponent(parts[0] || "");
			var rest = parts.slice(1).join("=");
			if (!rest) rest = "";
			var v = decodeURIComponent(rest.replace(/\+/g, " "));
			if (k === "p" || k === "c" || k === "n") q[k] = v;
		}
		return q;
	}

	function cleanName(raw) {
		var n = String(raw || "").replace(/[\u0000-\u001F<>"']/g, "").replace(/^\s+|\s+$/g, "");
		if (n.length > 25) n = n.slice(0, 25);
		if (!n) n = "Игрок";
		return n;
	}

	function copyText(text) {
		text = String(text || "");
		if (!text) return;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text);
			return;
		}
		var node = document.createElement("textarea");
		node.value = text;
		document.body.appendChild(node);
		node.select();
		try {
			document.execCommand("copy");
		} catch (e) {}
		document.body.removeChild(node);
	}

	function cashierSum(pack) {
		var n = Number(pack.min) || 0;
		if (n < CASHIER_MIN) return CASHIER_MIN;
		return n;
	}

	function cashierUrl(pack, code, name) {
		var sum = String(cashierSum(pack));
		return (
			CASHIER +
			"?sum=" +
			encodeURIComponent(sum) +
			"&amount=" +
			encodeURIComponent(sum) +
			"&comment=" +
			encodeURIComponent(code) +
			"&message=" +
			encodeURIComponent(code) +
			"&name=" +
			encodeURIComponent(name) +
			"&currency=RUB"
		);
	}

	var q = params();
	var pack = PACKS[q.p];
	var code = String(q.c || "").toUpperCase().trim();
	var name = cleanName(q.n);

	if (!pack || !CODE_RE.test(code)) {
		$("warn").hidden = false;
		$("warn").textContent = "Открой оплату из игры: F4, Донат, Оплатить.";
		return;
	}

	var paySum = cashierSum(pack);
	var url = cashierUrl(pack, code, name);

	$("card").hidden = false;
	$("codeText").textContent = code;
	$("packTitle").textContent = pack.title;
	$("packSum").textContent = pack.min + " ₽";
	$("packHint").textContent = pack.hint;
	if ($("payerName")) {
		$("payerName").hidden = false;
		$("payerName").textContent = "Имя в кассе: " + name;
	}
	$("payLink").href = url;
	$("payLink").textContent = "Оплатить " + paySum + " ₽";
	$("foot").textContent = "Касса откроется в новом окне. Имя уже в буфере, если касса всё же спросит. VIP придёт сам.";

	if (paySum !== pack.min) {
		$("fillNote").hidden = false;
		$("fillNote").textContent = "В кассе будет " + paySum + " ₽. Этот лот всё равно выдастся.";
	}

	copyText(name);

	$("copyBtn").addEventListener("click", function () {
		copyText(code);
		$("copyBtn").textContent = "Код скопирован";
	});
	$("payLink").addEventListener("click", function (ev) {
		copyText(name);
		var win = window.open(url, "mostland_pay", "width=480,height=780,noopener");
		if (win) {
			ev.preventDefault();
		}
	});
})();
