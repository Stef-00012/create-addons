

  <link rel="stylesheet" href="styles/output.css" />

    <div className="justify-center mx-auto max-w-7xl p-3 text-lg bg-rbase text-rtext">

        <nav className="navbar rounded-box shadow-base-300/20 shadow-sm mt-4">
            <a className="link text-base-content link-neutral text-xl no-underline" href="#">Create Mod Index</a>
          </nav>
          </br>
        
        <div className="sm:flex sm:justify-between">
            <div className="sm:flex sm:justify-start">
                <div className="max-w-sm my-2 mr-2">
                    <!-- Filter by modloader -->
                    <select
                      multiple
                      data-select='{
                      "placeholder": "<span className=\"inline-flex items-center\"><span className=\"icon-[tabler--filter] shrink-0 size-4 me-2\"></span> Filter by modloader</span>",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClassNamees": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                      "toggleCountText": "selected",
                      "toggleCountTextMinItems": 5,
                      "dropdownClassNamees": "advance-select-menu",
                      "optionClassNamees": "advance-select-option selected:select-active",
                      "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
                      "extraMarkup": "<span className=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
                      }'
                      className="hidden"
                    >
                      <option value="name">Fabric</option>
                      <option value="email">Forge</option>
                      <option value="description">Neoforge</option>
                      <option value="user_id">Quilt</option>
                    </select>
                  </div>

                  <div className="max-w-sm my-2 mr-2">
                    <select
                      multiple
                      data-select='{
                      "placeholder": "<span className=\"inline-flex items-center\"><span className=\"icon-[tabler--filter] shrink-0 size-4 me-2\"></span> Filter by version</span>",
                      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                      "toggleClassNamees": "advance-select-toggle select-disabled:pointer-events-none select-disabled:opacity-40",
                      "toggleCountText": "selected",
                      "toggleCountTextMinItems": 5,
                      "dropdownClassNamees": "advance-select-menu",
                      "optionClassNamees": "advance-select-option selected:select-active",
                      "optionTemplate": "<div className=\"flex justify-between items-center w-full\"><span data-title></span><span className=\"icon-[tabler--check] shrink-0 size-4 text-primary hidden selected:block \"></span></div>",
                      "extraMarkup": "<span className=\"icon-[tabler--caret-up-down] shrink-0 size-4 text-base-content absolute top-1/2 end-3 -translate-y-1/2 \"></span>"
                      }'
                      className="hidden"
                    >
                      <option value="name">1.21.5</option>
                      <option value="email">1.21.4</option>
                      <option value="description">1.21.3</option>
                      <option value="user_id">1.21.2</option>
                    </select>
                  </div>
            </div>
              
              <div className="input rounded-full max-w-56 sm:my-2">
                <span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0"></span>
                <label className="sr-only" for="searchInput">Mod name</label>
                <input type="search" className="grow" placeholder="Search" id="searchInput" />
              </div>
        </div>

          <div className="py-2 sm:flex sm:flex-wrap sm:justify-between my-2">

          <div className="card sm:max-w-lg my-2">
            <div className="card-body">
              <h5 className="card-title mb-0">
                <img src="https://placehold.co/20"  className="size-12 inline-block" ="mod logo">
                Mod Title
                <img src="assets/fabric.png" alt="fabric logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/forge.ico" alt="forge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/neoforge.png" alt="neoforge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/quilt.svg" alt="qulit logo" className="mask mask-squircle size-8 inline-block">

              </h5>
              <ul>
                <li><span className="icon-[tabler--hash] pt-2"></span> Version: x.x.x (Modloader)</li>
                <li><span className="icon-[tabler--download] pt-2"></span> Downloads: x</li>
                <li><span className="icon-[tabler--user] pt-2"></span> Creator: [x](link to x's profile)</li>
                <li><span className="icon-[tabler--heart] pt-2"></span> Followers: x</li>
                <li><span className="icon-[tabler--category] pt-2"></span> Categories: x, x, x</li>
                <!-- <li><span className="icon-[tabler--text-caption] pt-2"></span> Description: x... (cut off at 300 characters)</li> -->
              </ul>
            </div>
          </div>

          <div className="card sm:max-w-lg my-2">
            <div className="card-body">
              <h5 className="card-title mb-0">
                <img src="https://placehold.co/20"  className="size-12 inline-block" ="mod logo">
                Mod Title
                <img src="assets/fabric.png" alt="fabric logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/forge.ico" alt="forge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/neoforge.png" alt="neoforge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/quilt.svg" alt="qulit logo" className="mask mask-squircle size-8 inline-block">

              </h5>
              <ul>
                <li><span className="icon-[tabler--hash] pt-2"></span> Version: x.x.x (Modloader)</li>
                <li><span className="icon-[tabler--download] pt-2"></span> Downloads: x</li>
                <li><span className="icon-[tabler--user] pt-2"></span> Creator: [x](link to x's profile)</li>
                <li><span className="icon-[tabler--heart] pt-2"></span> Followers: x</li>
                <li><span className="icon-[tabler--category] pt-2"></span> Categories: x, x, x</li>
                <!-- <li><span className="icon-[tabler--text-caption] pt-2"></span> Description: x... (cut off at 300 characters)</li> -->
              </ul>
            </div>
          </div>

          <div className="card sm:max-w-lg my-2">
            <div className="card-body">
              <h5 className="card-title mb-0">
                <img src="https://placehold.co/20"  className="size-12 inline-block" ="mod logo">
                Mod Title
                <img src="assets/fabric.png" alt="fabric logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/forge.ico" alt="forge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/neoforge.png" alt="neoforge logo" className="mask mask-squircle size-8 inline-block">
                <img src="assets/quilt.svg" alt="qulit logo" className="mask mask-squircle size-8 inline-block">

              </h5>
              <ul>
                <li><span className="icon-[tabler--hash] pt-2"></span> Version: x.x.x (Modloader)</li>
                <li><span className="icon-[tabler--download] pt-2"></span> Downloads: x</li>
                <li><span className="icon-[tabler--user] pt-2"></span> Creator: [x](link to x's profile)</li>
                <li><span className="icon-[tabler--heart] pt-2"></span> Followers: x</li>
                <li><span className="icon-[tabler--category] pt-2"></span> Categories: x, x, x</li>
                <!-- <li><span className="icon-[tabler--text-caption] pt-2"></span> Description: x... (cut off at 300 characters)</li> -->
              </ul>
            </div>
          </div>
        
        </div>

          <br>

        <!-- Footer -->
        <footer className="footer bg-base-200/60 px-6 py-4 rounded-2xl">
            <div className="flex w-full items-center justify-between">
            <aside className="grid-flow-col items-center">
              <p>©2025 <a href="https://stefdp.com" className="link2 text-riris">Stef</a> & <a href="https://orangc.net" className="link2 text-[#fab387]">orangc</a>.</p>
            </aside>
              <div className="flex gap-4 h-5">
                <a href="#" className="link" aria-label="Github Link">
                  <span className="icon-[tabler--brand-github] size-5"></span>
                </a>
              </div>
            </div>
          </footer>