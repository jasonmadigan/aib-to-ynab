# AIB to YNAB

[AIB](https://personal.aib.ie/) have recently started to support CSV exports of historical transactions for Personal Account holders. This tool lets you transform these CSVs into a format expected by YNAB.

## Install

		npm install -g aib-to-ynab

## Usage

		aib-to-ynab --file=Transaction_Export.csv --output=Transaction_Export_CONVERTED.csv [--map=map.json]

## Mapping files
If you supply a mapping file, we'll try to map AIB transactions to payees and categories. This matching is pretty simple, keys in a JSON file are matched with transaction descriptions with a "starts with" check. So, for example, a transaction with a description of `VDP-PAYPAL` will match transactions that start with this (e.g. `VDP-PAYPAL *SPOTIF` would match). Beneath these keys is an object with two keys: `payee` & `category`, which you can use to specify your payees and categories. Payees and categories here work the same way they do in YNAB, so transfers, for example, will have the same rules as YNAB for whether they need a category or not.

Examples speak louder than words, here's a sample `map.json`:

		{
		  "VDP-Amazon *Mktplc": {
		    "payee": "Amazon Marketplace",
		    "category": "Everyday Expenses: Amazon"
		  },
		  "VDA-": {
		    "payee": "Transfer: Cash",
		    "category": ""
		  },
		  "D/D BORD GAIS EIRE": {
		    "payee": "Bord Gais",
		    "category": "Monthly Bills: Gas and Electricity"
		  }
		}

If a map isn't found, the transformer falls back to using the description for both `payee` and `category`.
