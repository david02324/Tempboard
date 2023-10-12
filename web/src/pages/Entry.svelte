<script>
    import logo from '../assets/logo.png'
    import {push} from "svelte-spa-router";
    import {onMount} from "svelte";

    const fetchName = async () => {
        const res = await fetch('/api/user/name')
        if (!res.ok) {
            alert(res)
            return
        }

        const resJson = await res.json()
        return resJson.name
    }

    let passwordInput = ''
    let rememberMeInput = false
    const tryEnter = async () => {
        const res = await fetch(
            '/api/user/enter',
            { body: JSON.stringify({ password: passwordInput }), method: 'POST', headers: { 'Content-Type': 'application/json'} }
        )

        switch (res.status) {
            case 202:
                const resJson = await res.json()
                rememberMeInput ? localStorage.setItem('hashed', resJson.hashed)
                    : sessionStorage.setItem('hashed', resJson.hashed)

                push('/board')
                return
            case 401:
                alert('password wrong')
                return
            default:
                alert(`ERROR: ${res}`)
        }
    }

    // enter with saved token
    onMount(() => {
        const token = localStorage.getItem('hashed') || sessionStorage.getItem('hashed')
        if (!token) return

        push('/board')
    })
</script>

<div class="flex items-center justify-center w-full h-full">
    <div class="flex flex-col gap-y-1 items-center">
        <img src={logo} class="w-4/5 min-w-[260px]" alt="logo" />
        {#await fetchName()}
            Loading...
        {:then name}
            <span class="block mb-4 text-lg font-medium text-gray-900 dark:text-white">Welcome {name}!</span>
            <div class="flex gap-x-2">
                <input type="password" id="password" bind:value={passwordInput} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="password">
                <button type="button" on:click={tryEnter} class="h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Enter</button>
            </div>
            <div class="flex items-center">
                <input id="remember-me" type="checkbox" bind:value={rememberMeInput} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <label for="remember-me" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me on this device</label>
            </div>
        {/await}
    </div>
</div>
