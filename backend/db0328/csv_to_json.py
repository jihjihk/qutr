import pandas as pd
import json
import sys, getopt

def main(inputcsv):

	tri = pd.read_csv(inputcsv)
	en = pd.DataFrame(tri.en)
	ar = pd.DataFrame(tri.ar)
	cn = pd.DataFrame(tri.cn)
	cn_split = pd.DataFrame(tri.cn_split)
	pos = pd.DataFrame(tri.pos)

	en = en.rename(columns={"en":"phrase"})
	ar = ar.rename(columns={"ar":"phrase"})
	cn = cn.rename(columns={"cn":"phrase"})
	cn_split = cn_split.rename(columns={"cn_split":"phrase"})

	for langdf in [en, ar, cn, cn_split]:
	    langdf['pos'] = pos
	    for i in range(0, len(langdf)):
	        ## assigning a new index col with p0, p1... to differentiate string IDs with cardinal numbers
	        langdf.loc[i, 'id'] = "p" + str(i)
	        print(langdf.loc[i,'id'])
	    langdf.set_index("id", inplace=True)

	ar_json = ar.to_json(orient='index')
	arob = json.loads(ar_json)

	with open('ar.json', 'w') as outfile:
	    json.dump(arob, outfile)

	en_json = en.to_json(orient='index')
	enob = json.loads(en_json)

	with open('en.json', 'w') as outfile:
	    json.dump(enob, outfile)

	cn_json = cn.to_json(orient='index')
	cnob = json.loads(cn_json)

	with open('cn.json', 'w') as outfile:
	    json.dump(cnob, outfile)

	cn_split_json = cn_split.to_json(orient='index')
	cn_splitob = json.loads(cn_split_json)

	with open('cn_split.json', 'w') as outfile:
	    json.dump(cn_splitob, outfile)

if __name__ == "__main__":
	main(sys.argv[1])
