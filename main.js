class MyTable extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'closed' });
		this.name = '';
		this.username = '';
		this.email = '';
		this.website = '';
	}

	static get observedAttributes() {
		return [ 'name', 'username', 'email', 'website' ];
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch (name) {
			case 'name':
				this.name = newVal;
				break;

			case 'username':
				this.username = newVal;
				break;

			case 'email':
				this.email = newVal;
				break;

			case 'website':
				this.website = newVal;
				break;

			default:
				break;
		}
	}

	connectedCallback() {
		let template = `
			<style>
				table {
					border-collapse: collapse;
					font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
					font-size: 14px;
					border-spacing: 0;
					text-align: center;
				}
				th {
					background: #BCEBDD;
					color: #f44e03;
					padding: 10px 20px;
				}
				td {
					padding: 10px 20px;
					background: #F8E391;
				}
				td, th {
					border: 1px solid white;					
				}
				.user-table-row:hover {
					cursor: pointer;
					color: blue;
				}
				
			</style>
			<div class="wrapper">
				<table class="my-table">
					<tr>
						<th>Name</th>
						<th>Username</th>
						<th>Email</th>
						<th>Website</th>
					</tr>
					
				</table>
			</div>
		`;
		this.shadow.innerHTML = template;
		let data = this._getData();
		this._setData(data);
	}

	async _getData() {
		let data = await fetch('https://jsonplaceholder.typicode.com/users').then((response) => response.json());
		return data;
	}

	renderData() {
		let userTr = this.shadow.querySelector('.my-table').appendChild(document.createElement('tr'));
		userTr.className = 'user-table-row';
		userTr.onclick = function(e) {
			console.log(e.target.localName);
		};
		Array.from(this.attributes).forEach((attr) => {
			let userTd = document.createElement('td');
			userTd.className = 'user-table-cell';
			userTd.innerHTML = this[attr.nodeName];
			userTr.appendChild(userTd);
		});
	}

	setAttr(name, value) {
		this.setAttribute(name, value);
	}

	async _setData(data) {
		let users = await data;
		users.forEach(({ name, username, email, website }) => {
			this.setAttr('name', name);
			this.setAttr('username', username);
			this.setAttr('email', email);
			this.setAttr('website', website);
			this.renderData();
		});
	}
}

customElements.define('my-table', MyTable);
