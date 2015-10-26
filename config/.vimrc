set nocompatible " explicitly get out of vi-compatible mode
syntax on " syntax highlighting on
set number " show line numbers

set autoindent " automatically indent next line
set smartindent " try to indent lines according to the previous lines
set tabstop=4 " real tabs should be 4, and they will show with set list on
set shiftwidth=4 " auto-indent amount when using cindent, >>, << and stuff like that
set virtualedit=all "
set showmatch " show matching brackets
set ruler " Always show current positions along the bottom
set nohls " do not highlight searched for phrases
set incsearch " highlight as you type your search phrase
set backspace=indent,eol,start " set backspace more flexible
set cursorcolumn " highlight the current column
set cursorline " highlight current line
set laststatus=2 " always show the status line
set list "
set listchars=tab:>-,trail:- " show tabs and trailing
set report=0 " tell us when anything is changed via :...
set showcmd " show the command being typed
set scrolloff=10 " Keep 10 lines (top/bottom) for scope
set sidescrolloff=5 " Keep 5 lines at the size
set statusline=%F%m%r%h%w[%L][%{&ff}]%y[%p%%][%04l,%04v] " the status line
set ignorecase " case insensitive by default
set smartcase " if there are caps, go case-sensitive
colorscheme desert
