const Modal = {
  open() {
    // abrir modal
    // adicionar a classe active no modal

    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    // fechar modal
    // remover a classe active no modal
    document.querySelector(".modal-overlay").classList.remove("active");
  },
}; //===== create function toggle ======//

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finance:transaction')) || [];
  },
  set(transactions) {
    localStorage.setItem('dev.finance:transaction', JSON.stringify(transactions));
  }
}


const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  },
};

const DOM = {
  transactionContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação" />
        </td> 
    `;
    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(Transaction.incomes());

    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(Transaction.expenses());

    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransaction() {
    DOM.transactionContainer.innerHTML = '';
  }
};

const Utils = {

  formatDate(date) {
    const splittedDate = date.split("-")

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;

  },

  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const Form = {
  // clear form
  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  // save transaction
  saveTransaction(transaction) {
    Transaction.add(transaction);
  },

  // format values
  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    }
  },

  // search data in HTML
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  // get data value
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  // validate fields
  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  submit(event) {
    event.preventDefault();

    try {
      // validate form fields
      Form.validateFields();
      // format values
      const transaction = Form.formatValues();
      // save transaction
      Form.saveTransaction(transaction);
      // clear form
      Form.clearFields();
      // close modal
      Modal.close();

    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {

    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransaction();
    App.init()
  },
};

App.init();