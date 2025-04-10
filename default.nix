{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
  ];

  shellHook = ''
    npx @tailwindcss/cli -i ./styles/input.css -o ./styles/output.css --watch
  '';
}
