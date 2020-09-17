const createautocomplete=({
	root,
	renderoption,
	onselect,
	inputvalue,
	fetchdata
	})=>{

	root.innerHTML=`
		<label><b>Search</b></label>
		<input class="input"/>
		<div class="dropdown">
			<div class="dropdown-menu">
				<div class="dropdown-content results">
				</div>
			</div>
		</div>
	`
	
	let search;
	const oninput= async(event)=>{
		if(search)
		{
			if(search===event.target.value.trim())
				return;
		}
		search=event.target.value;
		const items=await fetchdata(event.target.value);
		if(!items.length)
		{	
			dropdown.classList.remove('is-active');
			return;
		}
		resultwrapper.innerHTML='';
		dropdown.classList.add('is-active')
		
		for(let item of items)
		{	
			
			option=document.createElement('a');
			option.classList.add('dropdown-item')
			option.innerHTML=renderoption(item);
			option.addEventListener('click',()=>{
				dropdown.classList.remove('is-active')
				input.value=inputvalue(item);
				onselect(item);
			})
			resultwrapper.append(option);
		}
		

	}
	const input=root.querySelector('input');
	const dropdown=root.querySelector('.dropdown')
	const resultwrapper=root.querySelector('.results')
	input.addEventListener('input',debounce(oninput,700));

	document.addEventListener('click',(event)=>{
		if(!root.contains(event.target))
			dropdown.classList.remove("is-active")
	})
}