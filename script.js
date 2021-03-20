/* Adicionando a url base da api */
const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

/* Função para facilitar o get dos elementos do HTML */
function getElement(element) {
    return document.querySelector(element);
}

/* Pegando os elementos do HTML */
const searchInput = getElement('.search-input');
const searchButton = getElement('.search-button');
const container = getElement('.card-pokemon');
const erroMessage = getElement('.error');

var pokeName; // Nome ou numero passado na caixa de busca
var pokemon; // Responsavel por guardar os dados recebidos da API
var damage; // Responsavel por guardar os dados das fraquezas e vantagens
var type; // Responsavel por guardar o tipo primário do pokemon
var card; // Responsavel por receber o HTML

const urlDamage = 'https://pokeapi.co/api/v2/type/';

/* Função que pega os dados da API e armazena na variável pokemon */
function requestPokeInfo(url, name, urlDamage) {
    /* Pegando os dados da API com fetch */
    fetch(url + name)
        .then(response => response.json())
        .then(data => {
            pokemon = data;
            type = pokemon.types.map(item => item.type.name);
            // console.log(type[0])    
        })
        .catch(err => console.log(err));

    fetch(urlDamage + type[0])
        .then(response => response.json())
        .then(data => {
            damage = data;
        })
        .catch(err => console.log(err));
}

/* Função que cria o card do Pokemon */
function createCard() {
    card = `
    <div class="pokemon-main">
        <div class="picture-main">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="${pokemon.name}">
        </div>
        <p>${pokemon.name}</p>
        <p>${pokemon.types.map(item => item.type.name).join(" | ")}</p>
    </div>
    <div class="pokemon-description">
        <p>${pokemon.name} Nº${pokemon.id}</p>
        <p class="m">Altura: ${pokemon.height / 10} m</p>
        <p class="m">Peso: ${pokemon.weight / 10} kg</p>
        <p>Fraquezas: ${damage.damage_relations.double_damage_from.map(item => item.name).join(" | ")}</p>
        <p>Vantagens: ${damage.damage_relations.double_damage_to.map(item => item.name).join(" | ")}</p>
        <div class="picture-second">
            <img class="circle" src="${pokemon.sprites.front_default}" alt="">
            <img class="circle" src="${pokemon.sprites.front_shiny}" alt="">
        </div>
    </div>`

    return card;
}

// Função que faz a chamada das principais funções e inicia o app
function startApp(pokeName) {
    requestPokeInfo(baseUrl, pokeName, urlDamage);

    // A função que cria o HTML só será executada 2 segundos depois que a função startApp for executada
    setTimeout(function () {
        //Exibe uma mensagem caso o pokemon pesquisado não exista
        if (!pokemon) {
            erroMessage.style.display = 'block';
            container.style.display = 'none';
        } else {
            erroMessage.style.display = 'none';
            container.style.display = 'flex';
            container.innerHTML = createCard();
        }
    }, 2000);
}

/* Função que torma o campo de pesquisa dinâmico */
searchButton.addEventListener('click', event => {
    event.preventDefault();
    pokeName = searchInput.value.toLowerCase(); // Recebe o valor digitado pelo usuário
    startApp(pokeName);
    container.classList.add('fade');

    // Reseta o efeito fade removendo a classe fade
    setTimeout(() => {
        container.classList.remove('fade');
    }, 3000);
});