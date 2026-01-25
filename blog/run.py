
origin = open('C://SuBonan//Blog//source//_posts//日本语翻译.md', 'r', encoding = 'utf-8')
to = open('C://SuBonan//Blog//source//_posts//日本语重点.md', 'w', encoding = 'utf-8')

line = origin.readline()
num = 0
while 1:
    if not line:
        break
    if '**' in line:
        num += 1
        line = str(num) + '、' + line + '\n'
        to.write(line)
        line = origin.readline()
        while 1:
            l = origin.readline()
            st = len(l) - len(l.lstrip())
            if l[st : st + 1] == '*' and l[st + 1 : st + 2] == ' ':
                to.write(l + '\n')
            else:
                line = l
                break
    else:
        line = origin.readline()
origin.close()
to.close()
