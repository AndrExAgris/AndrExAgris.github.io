document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Carregar dados dos bookmarks
        const response = await fetch('bookmarks.yaml');
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);
        
        // Elementos DOM
        const categorySelect = document.getElementById('categorySelect');
        const categoriesContainer = document.getElementById('categoriesContainer');
        const searchBox = document.querySelector('.section_2_search_box');

        // Popular dropdown de categorias
        data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        // Função para renderizar categorias
        function renderCategories(selectedCategory) {
            categoriesContainer.innerHTML = '';
            
            data.categories
                .filter(category => selectedCategory === 'all' || category.name === selectedCategory)
                .forEach(category => {
                    const categoryBlock = document.createElement('div');
                    categoryBlock.className = 'category_block';
                    
                    let html = `
                        <h2 class="category_title">${category.name}</h2>
                        <div class="lists_grid">
                    `;

                    category.lists.forEach(list => {
                        html += `
                            <div class="list_block">
                                <h3 class="list_title">${list.name}</h3>
                                ${list.items.map(item => `
                                    <div class="bookmark_item">
                                        <a href="${item.url}" class="bookmark_link" target="_blank">
                                            ${item.title}
                                        </a>
                                        <div class="tags">
                                            ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    });

                    html += '</div>';
                    categoryBlock.innerHTML = html;
                    categoriesContainer.appendChild(categoryBlock);
                });
        }

        // Filtro por categoria
        categorySelect.addEventListener('change', (e) => {
            renderCategories(e.target.value === 'all' ? 'all' : e.target.value);
        });

        // Filtro de pesquisa
        searchBox.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.bookmark_item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? 'flex' : 'none';
            });
        });

        // Carregar inicial
        renderCategories('all');

    } catch (error) {
        console.error('Erro ao carregar bookmarks:', error);
    }
});