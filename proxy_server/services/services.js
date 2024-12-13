const soap = require("soap");
const xml2js = require("xml2js");
const axios = require("axios");

const cbrWsdlUrl = "https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL";

const services = {
	ProxyService: {
		ProxyServiceSoap: {
			getValutes: async function (args, callback) {
				try {
					const currentDate = new Date().toISOString();

					const cbrClient = await soap.createClientAsync(cbrWsdlUrl);

					const getCursOnDateResult =
						await cbrClient.GetCursOnDateXMLAsync({
							On_date: currentDate,
						});

					const cursXml =
						getCursOnDateResult[0].GetCursOnDateXMLResult;
					const cursJson = await xml2js.parseStringPromise(cursXml);

					const enumValutesResult =
						await cbrClient.EnumValutesXMLAsync({
							Seld: false,
						});

					const valutesXml =
						enumValutesResult[0].EnumValutesXMLResult;
					const valutesJson = await xml2js.parseStringPromise(
						valutesXml
					);

					const valutes = cursJson.ValuteData.ValuteCursOnDate;
					const valuteInfo = valutesJson.Valuta.Valute;

					const result = valutes.map((valute) => {
						const code = valute.Vcode[0];
						const value = parseFloat(
							valute.Vcurs[0].replace(",", ".")
						);
						const nameEntry = valuteInfo.find(
							(v) => v.Vcode[0] === code
						);
						const name = nameEntry.Vname[0];

						return {
							code,
							name,
							value,
						};
					});

					callback(null, {
						getValutesResult: JSON.stringify(result),
					});
				} catch (error) {
					console.error("Ошибка в getValutes:", error);
					callback(error);
				}
			},

			getValute: async function (args, callback) {
				try {
					const { code, fromDate, toDate } = args;

					const from = new Date(fromDate).toISOString();
					const to = new Date(toDate).toISOString();

					const cbrClient = await soap.createClientAsync(cbrWsdlUrl);

					const result = await cbrClient.GetCursDynamicXMLAsync({
						FromDate: from,
						ToDate: to,
						ValutaCode: code,
					});

					const dynamicXml = result[0].GetCursDynamicXMLResult;
					const dynamicJson = await xml2js.parseStringPromise(
						dynamicXml
					);

					const cursData = dynamicJson.ValuteData.ValuteCursDynamic;

					const data = cursData.map((entry) => {
						return {
							date: new Date(
								entry.CursDate[0]
							).toLocaleDateString(),
							value: parseFloat(entry.CursDate[0]),
						};
					});

					callback(null, { getValuteResult: JSON.stringify(data) });
				} catch (error) {
					console.error("Ошибка в getValute:", error);
					callback(error);
				}
			},
		},
	},
};

module.exports = services;
