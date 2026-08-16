(function () {
	"use strict";

	var PACKS = {
		week: { min: 100, title: "VIP 7 дней" },
		month: { min: 300, title: "VIP 30 дней" },
		life: { min: 700, title: "VIP навсегда" }
	};
	var WIDGET =
		"https://widget.donatepay.eu/widgets/page/438966ca791f356f2ba593c54b69bd786a245d0a84a6e6946db4491fdf9a74d6";
	var WIDGET_ID = "292167";
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
			var v = decodeURIComponent((parts.slice(1).join("=") || "").replace(/\+/g, " "));
			if (k === "p" || k === "c") q[k] = v;
		}
		return q;
	}

	function showWarn(text) {
		var el = $("warn");
		el.hidden = false;
		el.textContent = text;
	}

	function setLead(text) {
		$("lead").textContent = text;
	}

	var q = params();
	var pack = PACKS[q.p];
	var code = String(q.c || "").toUpperCase().trim();

	if (!pack) {
		setLead("Ссылка без пакета. Откройте оплату из игры.");
		showWarn("Параметр пакета отвергнут.");
		return;
	}
	if (!CODE_RE.test(code)) {
		setLead("Ссылка без кода MOST. Откройте оплату из игры.");
		showWarn("Код отвергнут. Ник и чужой текст не принимаются.");
		return;
	}

	setLead("Вставьте этот код в сообщение кассы, если поле пустое. Сумму сервер читает у DonatePay, не с этой страницы.");

	$("codeBlock").hidden = false;
	$("codeText").textContent = code;
	$("packBlock").hidden = false;
	$("packTitle").textContent = pack.title;
	$("packSum").textContent = pack.min + " ₽";

	$("copyBtn").addEventListener("click", function () {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(code);
		}
	});

	var src =
		WIDGET +
		"?widget_id=" +
		encodeURIComponent(WIDGET_ID) +
		"&sum=" +
		encodeURIComponent(String(pack.min));
	var frame = $("payFrame");
	frame.hidden = false;
	frame.src = src;
})();
