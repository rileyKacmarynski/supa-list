const useAddItem = () => ({
	trigger: (text: string) => console.log('creating item', text),
	isMutating: false,
})

export default useAddItem
