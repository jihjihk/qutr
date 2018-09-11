import pandas as pd

ar = pd.read_csv("ar40.csv")
en = pd.read_csv("en40.csv")
cn = pd.read_csv("cn40.csv")

def translate(query, target):
    #phrase id: pid
    final = ""
    np = ""
    temp = ""
    raw = ""
    
    for pid in query:
        if type(pid) is int:
            np += str(pid)
            raw += str(pid) + " | "
        else:
            prow = target.loc[target["id"] == pid].iloc[0]
            raw += prow.phrase + " | "

            #print(prow.complete)

            if prow.pos == "phrs":
                final += prow.phrase + "\t"
            else:
                ## there can only be one templating sentence per query
                if "*" in prow.phrase and prow.pos == "vp":
                        temp = prow.phrase
                else:
                    np += prow.phrase.replace("*", "").lower()
                    
    if temp != "":
        temp = temp.replace("*", np)
    final += temp
    
    print("Query IDs were: " + raw + "\n")
    print(final)
    print("---\n")


translate(["p21", 5, "p22"], cn)
translate(["p36"], cn)
translate(["p3", "p35", "p15"], cn)
translate(["p16", "p17"], cn)