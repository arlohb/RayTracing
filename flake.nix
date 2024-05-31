{
  description = "A simple project using vanilla JS with Node.";
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
  };
  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ (import rust-overlay) ];
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            nodePackages.typescript-language-server

            (rust-bin.fromRustupToolchainFile ./src/RayTracing/rs-ray-tracing/toolchain.toml)
            rust-analyzer
          ];
        };
      }
    );
}
