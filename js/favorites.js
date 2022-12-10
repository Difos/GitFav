import {GithubUser} from './GithubUser.js'

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
    }

    async add(username){
        try{
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error('User already exists')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw new Error('User not found')
            }

             this.entries =[user,...this.entries]
             this.update()
             this.save()
        }
        catch(error){
            alert(error.message)
        }
    }

    save(){
        localStorage.getItem('@github-favorites',JSON.stringify(this.entries))
    }

    delete(user){
        const filteredEntries = this.entries.filter(
            (entry) => entry.login !== user.login)
            this.entries = filteredEntries
            this.update()
            this.save()
    
    }
}

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onAdd()
    }

    update(){
        this.removeAllTr()

        this.entries.forEach((user)=>{
            const row = this.createRow()

            row.querySelector(  
                ".user img"
            ).src = `https://github.com/${user.login}.png`;

            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user img").alt = `Imagem de ${user.name}`
            row.querySelector(".user a").href = `https: //github.com/${user.login}`
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".fallowers").textContent = user.followers

            row.querySelector(".remove").onclick = () => {
                const isOk = confirm("Are you sure about delete this row?")

                if(isOk){
                    this.delete(user)

                }
            }
            this.tbody.append(row)
        })
    }

    onAdd(){
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const {value} = this.root.querySelector('.search input')
            this.add(value);
        }
    }

    createRow(){
        const tr = document.createElement("tr")

        const content = `
        <td class="user">
            <img  src="https://github.com/Difos.png" alt="">
            <a href="https://github.com/Difos" target="_blank">
                <p>Difos</p>
                <span>difos</span>
            </a>
        </td>
        <td class="repositories">10</td>
        <td class="fallowers">1200</td>
        <td>
            <button class="remove">Remover</button>
        </td>
    `
        tr.innerHTML = content

        return tr

    }

    removeAllTr(){
        this.tbody.querySelectorAll("tr").forEach((tr) => {
            tr.remove();
          });
    }
}