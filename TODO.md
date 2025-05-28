- [ ] Update `src/components/Card.tsx` and `src/components/List.tsx` to support curseforge

- [ ] Better checking for modrinth/curseforge alternative

1. fetch curseforge mc mods with Create filter - ~20 reqs
    `GET https://api.curseforge.com/v1/mods/search?gameId=432&classId=6&categoryId=6484&sortField=downloadCount&sortOrder=desc&pageSize=50&index=<XXX>`
    - [[https://docs.curseforge.com/rest-api/?shell#search-mods]]

2. for each of them store their hashes in a map
3. search modrinth mods with "create" query - ~20 reqs
    `GET https://api.modrinth.com/v2/search?query=create&limit=100&facets=%5B%5B%22project_type%3Amod%22%5D%5D&offset=<XXX>`
    - [[https://docs.modrinth.com/api/operations/searchprojects/]]

4. check the dependencies of the search results - ~600 reqs
    `GET https://api.modrinth.com/v2/project/<SLUG|ID>/dependencies`
    - [[https://docs.modrinth.com/api/operations/getdependencies/]]

5. get the full mod data (so to get versions IDs)
    `GET https://api.modrinth.com/v2/projects?ids=["ID1","ID2","IDn","..."]`
    - [[https://docs.modrinth.com/api/operations/getprojects/]]

6. get the versions hashes of the search results ~2 reqs
    `GET https://api.modrinth.com/v2/versions?ids=["ID1","ID2","IDn","..."]`
    - [[https://docs.modrinth.com/api/operations/getversions/]]

7. compare to curseforge's hashes