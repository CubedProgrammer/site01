length=$#
length=$((length-1))
if test $length -eq 0; then
	rsync -a $1 cp@172.105.19.161:\~/01/$1
else
	rsync -a ${@:1:length} cp@172.105.19.161:\~/01/${@: -1:1}
fi
