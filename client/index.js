const soap = require("soap");

const url = "http://localhost:8000/wsdl?wsdl";

// Функция для вызова getValutes
function getValutes() {
	soap.createClient(url, function (err, client) {
		if (err) throw err;

		client.getValutes({}, function (err, result) {
			if (err) throw err;

			const data = JSON.parse(result.getValutesResult);
			console.log("Результат getValutes:");
			console.log(JSON.stringify(data, null, 2));
		});
	});
}

// Функция для вызова getValute с параметрами
function getValute(code, fromDate, toDate) {
	soap.createClient(url, function (err, client) {
		if (err) throw err;

		const args = {
			code,
			fromDate,
			toDate,
		};

		client.getValute(args, function (err, result) {
			if (err) throw err;

			const data = JSON.parse(result.getValuteResult);
			console.log(`Результат getValute для кода ${code}:`);
			console.log(JSON.stringify(data, null, 2));
		});
	});
}

// Пример использования
getValutes();

getValute("R01235", "2023-10-01", "2023-10-15");
