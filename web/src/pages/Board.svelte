<script>
    import {onMount} from "svelte";
    import {replace} from "svelte-spa-router";

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('hashed')}`
    }

    let recent = null
    let currentImage = ''
    let currentText = ''
    let copiedAlert = false
    onMount(async () => {
        fetchRecent()

        try {
            currentText = await navigator.clipboard.readText()
        } catch (ignored) {
        }

        try {
            const clipboardItems = await navigator.clipboard.read()
            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const imageUrl = URL.createObjectURL(blob);
                        currentImage = imageUrl
                    }
                }
            }
        } catch (ignored) {
        }
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

        const resJson = await res.json()
        switch (resJson.type) {
            case 'text':
            case 'image':
                recent = resJson
                break
            case 'null':
                recent = null
        }
        return recent
    }

    const tryUploadText = async () => {
        if (currentText.length === 0) return

        const res = await fetch(
            '/api/board/upload/text',
            { headers: headers, body: JSON.stringify({ text: currentText }), method: 'POST' }
        )
        if (!res.ok) {
            alert('Upload error', res)
            return
        }

        fetchRecent()
    }

    const tryUploadImage = async () => {
        if (!currentImage) return

        const blob = await (await fetch(currentImage)).blob()
        const formData = new FormData();
        formData.append('file', blob, 'file.png')

        const res = await fetch(
            '/api/board/upload/image',
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('hashed')}` }, body: formData, method: 'POST' }
        )
        if (!res.ok) {
            alert('Upload error', res)
            return
        }

        fetchRecent()
    }

    const copyRecent = async () => {
        if (!recent) return

        switch (recent.type) {
            case 'text':
                await navigator.clipboard.writeText(recent.data)
                break
            case 'image':
                const res = await fetch(document.getElementById('recentImage').src)
                const blob = await res.blob()

                const item = new ClipboardItem({ [blob.type]: blob })
                await navigator.clipboard.write([item])
                break
        }

        copiedAlert = true
        setTimeout(() => copiedAlert = false, 5000)
    }
</script>

<div class="flex flex-col gap-y-5 items-center justify-center w-full lg:w-[1024px] h-full">
    <div class="flex flex-col gap-y-2 items-center w-[640px]">
        <div class="flex gap-x-2 w-[480px]">
            {#if currentImage}
                <button class="w-[640px]" on:click={tryUploadImage}>
                    <img id="current-image" src="{currentImage}"  class="hover:opacity-50 hover:cursor-pointer" alt="currentImage" width="640" />
                </button>
            {/if}
            {#if currentText}
                <input type="text" id="text-input" bind:value={currentText} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="text">
                <button type="button" on:click={tryUploadText} class="h-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Upload</button>
            {/if}
        </div>
    </div>
    {#if recent !== null}
        <div class="flex-col gap-y-2 w-[640px]">
            <h1 class="text-2xl">Recent</h1>
            <button on:click={copyRecent} class="rounded-lg hover:shadow-lg hover:cursor-pointer text-lg
                        border border-cyan-400 w-full min-h-[80px] flex flex-col justify-center items-center px-2 py-1">
                {#if recent.type === 'text'}
                    <div class="max-w-[600px]">{recent.data}</div>
                {:else if recent.type === 'image'}
                    <img id="recentImage" src="data:image/png;base64,{recent.data}" alt="recentImage" width="640"/>
                {/if}
                <div class="w-full text-sm text-right">{(new Date(recent.createdAt)).toLocaleString()}</div>
            </button>
        </div>
    {/if}
</div>

{#if copiedAlert}
    <div class="fixed bottom-5 right-5 bg-green-300 text-green-700 py-3 px-5 text-md rounded-lg min-w-[400px]">
        Copied!
    </div>
{/if}
