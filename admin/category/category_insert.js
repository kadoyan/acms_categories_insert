document.addEventListener("DOMContentLoaded", function () {
	const code_list = document.getElementById("category_code");
	const name_list = document.getElementById("category_name");
	const submitButton = document.getElementById("submit");
	const runButton = document.getElementById('run');
	const insertForm = document.getElementById("insert_form");

	if (!htmx || !code_list || !name_list || !submitButton || !runButton) {
		console.error("必須要素が見つかりません。");
		return;
	}
	const runButtonLabel = runButton.innerText;

	let index = 0;
	const stats = {
		codes: [],
		names: []
	};

	function triggerFormSubmit(idx) {
		console.log(`triggerFormSubmit:${idx}`);
		document.getElementById("input_code").value = stats.codes[idx];
		document.getElementById("input_name").value = stats.names[idx];
		submitButton.click();
	}

	insertForm.addEventListener('htmx:beforeRequest', function (evt) {
		console.log("追加中");
	});

	insertForm.addEventListener('htmx:afterRequest', function (evt) {
		if (index < stats.codes.length - 1) {
			index += 1;
			triggerFormSubmit(index);
		} else {
			console.log("追加完了");
			const currentList = document.getElementById("current_list");
			if (currentList) {
				currentList.click();
			}
			runButton.disabled = false;
			runButton.innerText = runButtonLabel;
		}
	});

	runButton.addEventListener('click', function () {
		const codes = code_list.value.trim();
		const names = name_list.value.trim();

		// カテゴリーコードと名前が空でないかチェック
		if (!codes || !names) {
			alert("カテゴリー名と対応するカテゴリーコードを入力してください。");
			return;
		}

		// カテゴリーを改行で分割し配列に変換
		stats.codes = codes.split("\n");
		stats.names = names.split("\n");

		// コードと名前の数が一致するかを確認
		if (stats.codes.length !== stats.names.length) {
			alert("カテゴリー名とカテゴリーコードの数が一致しません。");
			return;
		}

		runButton.disabled = true;
		runButton.innerText = "カテゴリー追加中。おまちください。";
		index = 0;  // 送信開始時にインデックスをリセット
		// 最初の送信をトリガー
		triggerFormSubmit(index);
	});
});
