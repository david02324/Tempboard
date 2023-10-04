<script>
    import {onMount} from "svelte";
    import {replace} from "svelte-spa-router";

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('hashed')}`
    }

    let textInput = ''
    onMount(async () => {
        fetchRecent()

        navigator.clipboard.readText()
            .then(text => {
                textInput = text
            })
            .catch(err => {
                // do nothing
            });

        navigator.clipboard.read()
            .then(dataTransfer => {
                // 클립보드로부터 데이터를 가져옵니다.
                for (let i = 0; i < dataTransfer.length; i++) {
                    const item = dataTransfer[i];
                    console.log(item)
                    if (item.getType().startsWith('image')) {
                        const blob = item.getAsFile();
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        document.body.appendChild(img);
                    }
                }
            })
            .catch(err => {
                console.error("이미지 가져오기 실패:", err);
            });
    })

    const fetchRecent = async () => {
        const res = await fetch(
            '/api/board/recent',
            { headers }
        )
        if (!res.ok) {
            replace('/')
            return
        }
    }

    const tryUpload = async () => {
        if (textInput.length === 0) return

        const res = await fetch(
            '/api/board/upload/text',
            { headers: headers, body: JSON.stringify({ text: textInput }), method: 'POST' }
        )
        if (!res.ok) {
            alert('Upload error', res)
            return
        }


    }
</script>

<div class="flex items-center justify-center w-full lg:w-[1024px] h-full">
    <div class="flex flex-col gap-y-2 items-center w-[640px]">
        <div class="flex gap-x-2 w-[480px]">
            <input type="text" id="text-input" bind:value={textInput} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="text">
            <button type="button" on:click={tryUpload} class="h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Upload</button>
        </div>
        <h2 class="text-xl">OR</h2>
        <h1 class="text-2xl">Upload by paste!</h1>
    </div>
</div>